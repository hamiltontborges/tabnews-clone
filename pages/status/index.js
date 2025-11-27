import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Status</h1>
      <StatusContent />
    </div>
  );
}

function StatusContent() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading || !data) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  const updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  const database = data.dependencies.database;

  return (
    <div>
      <p style={styles.updatedAt}>Última atualização: {updatedAt}</p>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.iconCell}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#336791"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </td>
            <td style={styles.serviceCell}>
              <div style={styles.serviceName}>PostgreSQL</div>
              <div style={styles.serviceDetails}>Versão {database.version}</div>
            </td>
            <td style={styles.statusCell}>
              <div style={styles.statusBadge}>
                <span style={styles.statusDot}></span>
                Operacional
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table style={styles.metricsTable}>
        <tbody>
          <tr>
            <td style={styles.metricLabel}>Conexões máximas</td>
            <td style={styles.metricValue}>{database.max_connections}</td>
          </tr>
          <tr>
            <td style={styles.metricLabel}>Conexões abertas</td>
            <td style={styles.metricValue}>{database.opened_connections}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "60px auto",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#1a1a1a",
  },
  updatedAt: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "32px",
  },
  loading: {
    fontSize: "14px",
    color: "#666",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  iconCell: {
    width: "60px",
    padding: "20px",
    textAlign: "center",
    borderRight: "1px solid #d0d7de",
  },
  serviceCell: {
    padding: "20px",
  },
  serviceName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  serviceDetails: {
    fontSize: "14px",
    color: "#666",
  },
  statusCell: {
    width: "150px",
    padding: "20px",
    textAlign: "right",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    backgroundColor: "#dafbe1",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a7f37",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#1a7f37",
  },
  metricsTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    border: "1px solid #d0d7de",
    borderRadius: "8px",
  },
  metricLabel: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#666",
    borderBottom: "1px solid #d0d7de",
  },
  metricValue: {
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "right",
    borderBottom: "1px solid #d0d7de",
  },
};
