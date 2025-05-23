def __init__(self, config: Config):
        self.config = config
        self.state = State(config)
        self.git = GitHandler(config)
        self.all_files = self._get_all_files()
