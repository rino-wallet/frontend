export class IdleTimer {
  timeout: number;
  interval!: ReturnType<typeof setTimeout>;
  onTimeout: () => void;
  eventHandler!: () => void;
  timeoutTracker!: ReturnType<typeof setTimeout>;
  constructor({ timeout, onTimeout, onExpired }: { timeout: number; onTimeout: () => void; onExpired: () => void; }) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;

    const expiredTime = parseInt(localStorage.getItem("_expiredTime") || "0", 10);
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired();
      return;
    }

    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  startInterval(): void {
    this.updateExpiredTime();
    this.interval = setInterval(() => {
      const expiredTime = parseInt(
        localStorage.getItem("_expiredTime") || "0",
        10
      );
      if (expiredTime > 0 && expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 1000);
  }

  updateExpiredTime(): void {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem("_expiredTime", `${Date.now() + this.timeout * 1000}`);
    }, 300);
  }

  tracker(): void {
    window.addEventListener("mousemove", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }

  cleanUp(): void {
    localStorage.removeItem("_expiredTime");
    clearInterval(this.interval);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
  }
}
