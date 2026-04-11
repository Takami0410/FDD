const supabaseUrl = "https://xgoccholeihlylkwmphq.supabase.co";
const supabaseKey = "YOUR_ANON_KEY"; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadSessions() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  renderSessions(data);
}

function renderSessions(sessions) {
  const container = document.querySelector(".sessions-list");
  if (!container) return;

  container.innerHTML = "";

  sessions.forEach(session => {
    const date = new Date(session.date);
    const html = `
      <div class="session-row">
        <div class="session-date-block">
          <div class="session-day">${date.getDate()}</div>
          <div class="session-month">${date.toLocaleString('en', { month: 'short' })}</div>
        </div>
        <div>
          <div class="session-name">${session.name}</div>
          <div class="session-meta-row">
            <div class="session-time">${session.time || ""}</div>
          </div>
        </div>
        <div class="session-type">${session.type}</div>
        <div class="session-price">RM${session.price}</div>
        <div class="session-cta">
          <a class="btn-register" href="register.html?id=${session.id}">Register</a>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}

document.addEventListener("DOMContentLoaded", loadSessions);
