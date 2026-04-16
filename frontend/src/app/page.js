import styles from "./page.module.css";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getApiStatus(path) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
      };
    }

    const data = await response.json();

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      data: null,
      error: error.message,
    };
  }
}

function StatusCard({ title, result, successText, failureText }) {
  const isConnected = result.ok;

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <span
          className={`${styles.badge} ${isConnected ? styles.online : styles.offline}`}
        >
          {isConnected ? "Connected" : "Unavailable"}
        </span>
      </div>
      <p className={styles.cardText}>
        {isConnected ? successText : failureText}
      </p>
      <dl className={styles.meta}>
        <div>
          <dt>Endpoint</dt>
          <dd>{title === "Backend API" ? "/" : "/api/health/db"}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{result.status ?? "No response"}</dd>
        </div>
        <div>
          <dt>Details</dt>
          <dd>
            {result.data?.message ||
              result.data?.database ||
              result.error ||
              "No details available"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default async function Home() {
  const [apiResult, dbResult] = await Promise.all([
    getApiStatus("/"),
    getApiStatus("/api/health/db"),
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Full-stack dev environment</p>
          <h1>Next.js is now talking to your Express backend.</h1>
          <p className={styles.description}>
            The frontend is using <code>{apiBaseUrl}</code> as its API base URL
            and checks both the backend process and the PostgreSQL connection.
          </p>
        </div>

        <div className={styles.grid}>
          <StatusCard
            title="Backend API"
            result={apiResult}
            successText="The Next.js app successfully reached the Express server."
            failureText="The frontend could not reach the Express server."
          />
          <StatusCard
            title="PostgreSQL"
            result={dbResult}
            successText="The backend confirmed that the PostgreSQL database is connected."
            failureText="The backend responded, but the database check failed."
          />
        </div>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href={`${apiBaseUrl}/api/health`}
          >
            Open API Health
          </a>
          <a
            className={styles.secondary}
            href={`${apiBaseUrl}/api/health/db`}
          >
            Open DB Health
          </a>
        </div>
      </main>
    </div>
  );
}
