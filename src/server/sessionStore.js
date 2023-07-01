export class SessionStore {
  constructor() {
    this.sessions = new Map([
      [
        process.env.VITE_ID,
        {
          id: "",
          userID: "451fac04f7b6f147",
          username: "vite",
          connected: false,
        },
      ],
      [
        process.env.KEYBOARD_1_ID,
        {
          id: "",
          userID: "1",
          username: "kbd1",
          connected: false,
        },
      ],
      [
        process.env.KEYBOARD_2_ID,
        {
          id: "",
          userID: "2",
          username: "kbd2",
          connected: false,
        },
      ],
    ]);
  }

  // restoreSessions() {
  //   this.sessions.set("", {});
  // }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.entries()];
  }
}
