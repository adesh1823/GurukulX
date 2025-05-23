def main() -> None:
    """Parses arguments and runs the committer."""
    parser = argparse.ArgumentParser(description="Commit Python methods individually to a GitHub repository.")
    parser.add_argument('--folder', required=True, help="Path to the project folder (Git repository)")
    parser.add_argument('--token', required=True, help="GitHub personal access token")
    parser.add_argument('--repo', required=True, help="GitHub repository name (e.g., user/repo)")
    parser.add_argument('--state-file', help="Path to state file (default: .commit_state.json in project folder)")
    args = parser.parse_args()
    config = Config(args.folder, args.token, args.repo, args.state_file)
    Committer(config).run()
    def __init__(self, project_folder: str, github_token: str, repo_name: str, state_file: Optional[str] = None):
        self.project_folder = Path(project_folder).resolve()
        self.github_token = github_token
        self.repo_name = repo_name
        self.state_file = Path(state_file or self.project_folder / ".commit_state.json").resolve()
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
    def __init__(self, config: Config):
        self.config = config
        self.completed_files: set = set()
        self.partial_methods: Dict[str, List[int]] = {}  # Maps files to committed method indices
        self.current_wait_until: Optional[datetime] = None
        self.start_time = datetime.now()
        self.first_run = True
    def load(self) -> None:
        """Loads state from file if it exists."""
        if not self.config.state_file.exists():
            return
        try:
            with open(self.config.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.completed_files = set(data.get('completed_files', []))
                self.partial_methods = {k: [int(i) for i in v] for k, v in data.get('partial_methods', {}).items()}
                if wait_ts := data.get('current_wait_until'):
                    self.current_wait_until = datetime.fromtimestamp(wait_ts)
                if start_ts := data.get('start_time'):
                    self.start_time = datetime.fromtimestamp(start_ts)
                    self.first_run = False
            print(f"Loaded state: {len(self.completed_files)} completed files")
        except Exception as e:
            print(f"Error loading state: {e}, starting fresh")
    def save(self) -> None:
        """Saves state to file."""
        try:
            data = {
                'completed_files': list(self.completed_files),
                'partial_methods': self.partial_methods,
                'start_time': self.start_time.timestamp(),
                'current_wait_until': self.current_wait_until.timestamp() if self.current_wait_until else None
            }
            with open(self.config.state_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"State saved at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        except Exception as e:
            print(f"Error saving state: {e}")
    def __init__(self, config: Config):
        self.config = config
        self.repo = self._init_repo()
        try:
            self.github = Github(config.github_token)
            owner, repo_name = config.repo_name.split('/')
            self.github_repo = self.github.get_user(owner).get_repo(repo_name)
            print(f"Connected to GitHub repo: {config.repo_name}")
        except GithubException as e:
            print(f"Error connecting to GitHub: {e}")
            raise SystemExit(1)
    def _init_repo(self) -> git.Repo:
        """Initializes the Git repository."""
        try:
            repo = git.Repo(self.config.project_folder)
            origin = repo.remote(name='origin')
            print(f"Using git repo at {self.config.project_folder}, remote: {origin.url}")
            return repo
        except Exception as e:
            print(f"Error initializing repo: {e}")
            raise SystemExit(1)
    def commit_and_push(self, file_path: Path, message: str) -> bool:
        """Commits and pushes a file with the given message."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        try:
            if not file_path.exists():
                print(f"File not found: {rel_path}")
                return False
            self.repo.git.add(str(file_path))
            if not self.repo.is_dirty(path=str(file_path)):
                print(f"No changes to commit for {rel_path}")
                return True
            self.repo.index.commit(message)
            self.repo.remote(name='origin').push()
            print(f"Committed and pushed: {rel_path}")
            return True
        except GithubException as e:
            print(f"GitHub error for {rel_path}: {e}")
            return False
        except Exception as e:
            print(f"Error committing {rel_path}: {e}")
            return False
    def __init__(self, config: Config):
        self.config = config
        self.state = State(config)
        self.git = GitHandler(config)
        self.all_files = self._get_all_files()
    def _get_all_files(self) -> List[Path]:
        """Gets all files in the project directory, excluding .git and state file."""
        files = [
            p for p in self.config.project_folder.rglob('*')
            if p.is_file() and '.git' not in str(p) and p != self.config.state_file
        ]
        print(f"Found {len(files)} files")
        return files
    def _extract_methods(self, file_path: Path) -> Tuple[List[str], List[str]]:
        """Extracts method definitions from a Python file using AST."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            tree = ast.parse(content)
            methods = []
            method_names = []
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    method_code = '\n'.join(content.splitlines()[node.lineno-1:node.end_lineno])
                    methods.append(method_code)
                    method_names.append(node.name)
            return methods, method_names
        except (UnicodeDecodeError, SyntaxError) as e:
            print(f"Cannot parse {file_path}: {e}")
            return [], []
    def _get_remaining_files(self) -> Tuple[List[Path], List[Path]]:
        """Separates remaining files into Python and non-Python files."""
        python_files, other_files = [], []
        for file in self.all_files:
            rel_path = str(file.relative_to(self.config.project_folder))
            if rel_path in self.state.completed_files:
                continue
            if file.suffix == '.py':
                python_files.append(file)
            else:
                other_files.append(file)
        return python_files, other_files
    def _commit_method(self, file_path: Path, method_content: str, method_name: str, method_idx: int) -> bool:
        """Commits a single method to the repository."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(method_content.strip() + '\n')
            commit_msg = f"Add method {method_name} in {rel_path} (index {method_idx})"
            success = self.git.commit_and_push(file_path, commit_msg)
            if success:
                self.state.partial_methods.setdefault(rel_path, []).append(method_idx)
                if len(self.state.partial_methods[rel_path]) == len(self._extract_methods(file_path)[0]):
                    self.state.completed_files.add(rel_path)
                    del self.state.partial_methods[rel_path]
            return success
        except Exception as e:
            print(f"Error committing method {method_name}: {e}")
            return False
    def _commit_whole_file(self, file_path: Path) -> bool:
        """Commits an entire non-Python file."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        success = self.git.commit_and_push(file_path, f"Add {rel_path}")
        if success:
            self.state.completed_files.add(rel_path)
        return success
    def _display_progress(self, python_files: List[Path], other_files: List[Path]) -> None:
        """Displays progress with a progress bar and time estimates."""
        total_files = len(self.all_files)
        completed = len(self.state.completed_files)
        remaining = len(python_files) + len(other_files)
        progress_pct = (completed / total_files * 100) if total_files else 0
        elapsed = datetime.now() - self.state.start_time
        eta_str = "Unknown"
        if completed > 0 and remaining > 0:
            seconds_per_file = elapsed.total_seconds() / completed
            eta = timedelta(seconds=int(seconds_per_file * remaining))
            eta_str = str(eta)
        bar_length = 40
        filled = int(bar_length * completed / total_files) if total_files else 0
        bar = '█' * filled + '░' * (bar_length - filled)
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"\n{'=' * 60}\nGitHub Auto-Commit Progress\n{'=' * 60}")
        print(f"Progress: [{bar}] {progress_pct:.1f}%")
        print(f"Files: {completed}/{total_files} completed, {remaining} remaining")
        print(f"Types: {len(python_files)} Python, {len(other_files)} other")
        print(f"Time elapsed: {elapsed}")
        print(f"Estimated time remaining: {eta_str}\n{'=' * 60}\n")
    def run(self) -> None:
        """Runs the commit process with wait intervals and state management."""
        self.state.load()
        try:
            if self.state.current_wait_until and not self.state.first_run:
                wait_seconds = (self.state.current_wait_until - datetime.now()).total_seconds()
                if wait_seconds > 0:
                    print(f"Resuming wait: {int(wait_seconds)} seconds")
                    for _ in tqdm(range(int(wait_seconds)), desc="Waiting to resume"):
                        time.sleep(1)
                self.state.current_wait_until = None
                self.state.save()

            while True:
                python_files, other_files = self._get_remaining_files()
                self._display_progress(python_files, other_files)
                if not python_files and not other_files:
                    print("\n🎉 All files committed successfully! 🎉")
                    if self.config.state_file.exists():
                        os.remove(self.config.state_file)
                    break

                file_to_commit = None
                if python_files and (not other_files or random.random() < 0.7):
                    file_to_commit = random.choice(python_files)
                    methods, method_names = self._extract_methods(file_to_commit)
                    rel_path = str(file_to_commit.relative_to(self.config.project_folder))
                    committed_indices = set(self.state.partial_methods.get(rel_path, []))
                    uncommitted = [i for i in range(len(methods)) if i not in committed_indices]
                    if not uncommitted:
                        self.state.completed_files.add(rel_path)
                        if rel_path in self.state.partial_methods:
                            del self.state.partial_methods[rel_path]
                        continue
                    method_idx = random.choice(uncommitted)
                    print(f"Committing method {method_names[method_idx]} in {file_to_commit.name}")
                    self._commit_method(file_to_commit, methods[method_idx], method_names[method_idx], method_idx)
                    with open(file_to_commit, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(methods))  # Restore original content
                elif other_files:
                    file_to_commit = random.choice(other_files)
                    print(f"Committing file: {file_to_commit.name}")
                    self._commit_whole_file(file_to_commit)

                interval = random.randint(10, 50)
                self.state.current_wait_until = datetime.now() + timedelta(seconds=interval)
                self.state.save()
                print(f"\nNext commit at: {self.state.current_wait_until.strftime('%H:%M:%S')}")
                print(f"Waiting {interval} seconds...")
                try:
                    for _ in tqdm(range(interval), desc="Time until next commit"):
                        time.sleep(1)
                    self.state.current_wait_until = None
                    self.state.save()
                except KeyboardInterrupt:
                    print("\nPaused. Resume by running the script again.")
                    self.state.save()
                    raise
        except KeyboardInterrupt:
            print("\nPaused. Resume by running the script again.")
            self.state.save()
        except Exception as e:
            print(f"\nError: {e}")
            self.state.save()
            raise
    def __init__(self, project_folder: str, github_token: str, repo_name: str, state_file: Optional[str] = None):
        self.project_folder = Path(project_folder).resolve()
        self.github_token = github_token
        self.repo_name = repo_name
        self.state_file = Path(state_file or self.project_folder / ".commit_state.json").resolve()
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
    def __init__(self, config: Config):
        self.config = config
        self.completed_files: set = set()
        self.partial_methods: Dict[str, List[int]] = {}  # Maps files to committed method indices
        self.current_wait_until: Optional[datetime] = None
        self.start_time = datetime.now()
        self.first_run = True
    def load(self) -> None:
        """Loads state from file if it exists."""
        if not self.config.state_file.exists():
            return
        try:
            with open(self.config.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.completed_files = set(data.get('completed_files', []))
                self.partial_methods = {k: [int(i) for i in v] for k, v in data.get('partial_methods', {}).items()}
                if wait_ts := data.get('current_wait_until'):
                    self.current_wait_until = datetime.fromtimestamp(wait_ts)
                if start_ts := data.get('start_time'):
                    self.start_time = datetime.fromtimestamp(start_ts)
                    self.first_run = False
            print(f"Loaded state: {len(self.completed_files)} completed files")
        except Exception as e:
            print(f"Error loading state: {e}, starting fresh")
    def save(self) -> None:
        """Saves state to file."""
        try:
            data = {
                'completed_files': list(self.completed_files),
                'partial_methods': self.partial_methods,
                'start_time': self.start_time.timestamp(),
                'current_wait_until': self.current_wait_until.timestamp() if self.current_wait_until else None
            }
            with open(self.config.state_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"State saved at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        except Exception as e:
            print(f"Error saving state: {e}")
    def __init__(self, config: Config):
        self.config = config
        self.repo = self._init_repo()
        try:
            self.github = Github(config.github_token)
            owner, repo_name = config.repo_name.split('/')
            self.github_repo = self.github.get_user(owner).get_repo(repo_name)
            print(f"Connected to GitHub repo: {config.repo_name}")
        except GithubException as e:
            print(f"Error connecting to GitHub: {e}")
            raise SystemExit(1)
    def _init_repo(self) -> git.Repo:
        """Initializes the Git repository."""
        try:
            repo = git.Repo(self.config.project_folder)
            origin = repo.remote(name='origin')
            print(f"Using git repo at {self.config.project_folder}, remote: {origin.url}")
            return repo
        except Exception as e:
            print(f"Error initializing repo: {e}")
            raise SystemExit(1)
    def commit_and_push(self, file_path: Path, message: str) -> bool:
        """Commits and pushes a file with the given message."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        try:
            if not file_path.exists():
                print(f"File not found: {rel_path}")
                return False
            self.repo.git.add(str(file_path))
            if not self.repo.is_dirty(path=str(file_path)):
                print(f"No changes to commit for {rel_path}")
                return True
            self.repo.index.commit(message)
            self.repo.remote(name='origin').push()
            print(f"Committed and pushed: {rel_path}")
            return True
        except GithubException as e:
            print(f"GitHub error for {rel_path}: {e}")
            return False
        except Exception as e:
            print(f"Error committing {rel_path}: {e}")
            return False
    def __init__(self, config: Config):
        self.config = config
        self.state = State(config)
        self.git = GitHandler(config)
        self.all_files = self._get_all_files()
    def _get_all_files(self) -> List[Path]:
        """Gets all files in the project directory, excluding .git and state file."""
        files = [
            p for p in self.config.project_folder.rglob('*')
            if p.is_file() and '.git' not in str(p) and p != self.config.state_file
        ]
        print(f"Found {len(files)} files")
        return files
    def _extract_methods(self, file_path: Path) -> Tuple[List[str], List[str]]:
        """Extracts method definitions from a Python file using AST."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            tree = ast.parse(content)
            methods = []
            method_names = []
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    method_code = '\n'.join(content.splitlines()[node.lineno-1:node.end_lineno])
                    methods.append(method_code)
                    method_names.append(node.name)
            return methods, method_names
        except (UnicodeDecodeError, SyntaxError) as e:
            print(f"Cannot parse {file_path}: {e}")
            return [], []
    def _get_remaining_files(self) -> Tuple[List[Path], List[Path]]:
        """Separates remaining files into Python and non-Python files."""
        python_files, other_files = [], []
        for file in self.all_files:
            rel_path = str(file.relative_to(self.config.project_folder))
            if rel_path in self.state.completed_files:
                continue
            if file.suffix == '.py':
                python_files.append(file)
            else:
                other_files.append(file)
        return python_files, other_files
    def _commit_method(self, file_path: Path, method_content: str, method_name: str, method_idx: int) -> bool:
        """Commits a single method to the repository."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(method_content.strip() + '\n')
            commit_msg = f"Add method {method_name} in {rel_path} (index {method_idx})"
            success = self.git.commit_and_push(file_path, commit_msg)
            if success:
                self.state.partial_methods.setdefault(rel_path, []).append(method_idx)
                if len(self.state.partial_methods[rel_path]) == len(self._extract_methods(file_path)[0]):
                    self.state.completed_files.add(rel_path)
                    del self.state.partial_methods[rel_path]
            return success
        except Exception as e:
            print(f"Error committing method {method_name}: {e}")
            return False
    def _commit_whole_file(self, file_path: Path) -> bool:
        """Commits an entire non-Python file."""
        rel_path = str(file_path.relative_to(self.config.project_folder))
        success = self.git.commit_and_push(file_path, f"Add {rel_path}")
        if success:
            self.state.completed_files.add(rel_path)
        return success
    def _display_progress(self, python_files: List[Path], other_files: List[Path]) -> None:
        """Displays progress with a progress bar and time estimates."""
        total_files = len(self.all_files)
        completed = len(self.state.completed_files)
        remaining = len(python_files) + len(other_files)
        progress_pct = (completed / total_files * 100) if total_files else 0
        elapsed = datetime.now() - self.state.start_time
        eta_str = "Unknown"
        if completed > 0 and remaining > 0:
            seconds_per_file = elapsed.total_seconds() / completed
            eta = timedelta(seconds=int(seconds_per_file * remaining))
            eta_str = str(eta)
        bar_length = 40
        filled = int(bar_length * completed / total_files) if total_files else 0
        bar = '█' * filled + '░' * (bar_length - filled)
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"\n{'=' * 60}\nGitHub Auto-Commit Progress\n{'=' * 60}")
        print(f"Progress: [{bar}] {progress_pct:.1f}%")
        print(f"Files: {completed}/{total_files} completed, {remaining} remaining")
        print(f"Types: {len(python_files)} Python, {len(other_files)} other")
        print(f"Time elapsed: {elapsed}")
        print(f"Estimated time remaining: {eta_str}\n{'=' * 60}\n")
    def run(self) -> None:
        """Runs the commit process with wait intervals and state management."""
        self.state.load()
        try:
            if self.state.current_wait_until and not self.state.first_run:
                wait_seconds = (self.state.current_wait_until - datetime.now()).total_seconds()
                if wait_seconds > 0:
                    print(f"Resuming wait: {int(wait_seconds)} seconds")
                    for _ in tqdm(range(int(wait_seconds)), desc="Waiting to resume"):
                        time.sleep(1)
                self.state.current_wait_until = None
                self.state.save()

            while True:
                python_files, other_files = self._get_remaining_files()
                self._display_progress(python_files, other_files)
                if not python_files and not other_files:
                    print("\n🎉 All files committed successfully! 🎉")
                    if self.config.state_file.exists():
                        os.remove(self.config.state_file)
                    break

                file_to_commit = None
                if python_files and (not other_files or random.random() < 0.7):
                    file_to_commit = random.choice(python_files)
                    methods, method_names = self._extract_methods(file_to_commit)
                    rel_path = str(file_to_commit.relative_to(self.config.project_folder))
                    committed_indices = set(self.state.partial_methods.get(rel_path, []))
                    uncommitted = [i for i in range(len(methods)) if i not in committed_indices]
                    if not uncommitted:
                        self.state.completed_files.add(rel_path)
                        if rel_path in self.state.partial_methods:
                            del self.state.partial_methods[rel_path]
                        continue
                    method_idx = random.choice(uncommitted)
                    print(f"Committing method {method_names[method_idx]} in {file_to_commit.name}")
                    self._commit_method(file_to_commit, methods[method_idx], method_names[method_idx], method_idx)
                    with open(file_to_commit, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(methods))  # Restore original content
                elif other_files:
                    file_to_commit = random.choice(other_files)
                    print(f"Committing file: {file_to_commit.name}")
                    self._commit_whole_file(file_to_commit)

                interval = random.randint(10, 50)
                self.state.current_wait_until = datetime.now() + timedelta(seconds=interval)
                self.state.save()
                print(f"\nNext commit at: {self.state.current_wait_until.strftime('%H:%M:%S')}")
                print(f"Waiting {interval} seconds...")
                try:
                    for _ in tqdm(range(interval), desc="Time until next commit"):
                        time.sleep(1)
                    self.state.current_wait_until = None
                    self.state.save()
                except KeyboardInterrupt:
                    print("\nPaused. Resume by running the script again.")
                    self.state.save()
                    raise
        except KeyboardInterrupt:
            print("\nPaused. Resume by running the script again.")
            self.state.save()
        except Exception as e:
            print(f"\nError: {e}")
            self.state.save()
            raise