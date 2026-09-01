const apiUrl =
  "https://ynab-savings-api-d7b9dchcc3g2dbbc.centralus-01.azurewebsites.net/api/savings-summary";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

async function loadSavings() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const months = document.getElementById("months");

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    loading.hidden = true;

    for (const month of data) {
      const section = document.createElement("section");
      section.className = "month-card";

      const changeClass =
        month.Change >= 0 ? "positive" : "negative";

      const change =
        `${month.Change >= 0 ? "+" : "-"}${currency.format(
          Math.abs(month.Change)
        )}`;

      section.innerHTML = `
        <div class="month-header">
          <div class="month-title">
            <h2>${month.Month}</h2>
            <strong class="${changeClass}">
              ${change}
            </strong>
          </div>

          <div class="balance">
            Savings
            ${currency.format(month.StartingBalance)}
            →
            ${currency.format(month.EndingBalance)}
          </div>
        </div>

        <div class="expenses">
          ${month.Expenses.map(expense => `
            <div class="expense">
              <div>
                <strong>${expense.Category}</strong>
                <div class="description">
                  ${expense.Description ?? ""}
                </div>
              </div>

              <div class="amount">
                ${currency.format(expense.Amount)}
              </div>
            </div>
          `).join("")}
        </div>
      `;

      months.appendChild(section);
    }
  }
  catch (err) {
    console.error(err);

    loading.hidden = true;
    error.hidden = false;
    error.textContent = "Unable to load savings information.";
  }
}

loadSavings();