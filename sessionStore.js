export class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  restoreSessions() {
    this.sessions.set("e26c6df31536386c", {
      userID: "451fac04f7b6f147",
      username: "test",
      connected: false,
    });
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
