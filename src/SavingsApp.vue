<template>
  <div class="container">
    <h1 class="mt-4">Where Did the Savings Go?</h1>

    <p v-if="loading" class="lead">Loading...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <section
        v-for="month in months"
        :key="month.Month"
        class="my-5"
      >
        <h2>{{ month.Month }}</h2>

        <div class="d-flex justify-content-between mb-3">
          <span>
            Savings:
            {{ currency(month.StartingBalance) }}
            →
            {{ currency(month.EndingBalance) }}
          </span>

          <strong
            :class="month.Change >= 0 ? 'text-success' : 'text-danger'"
          >
            {{ signedCurrency(month.Change) }}
          </strong>
        </div>

        <div
          v-for="expense in month.Expenses"
          :key="`${expense.Date}-${expense.Category}-${expense.Amount}`"
          class="row border-top py-2"
        >
          <div class="col">
            <strong>{{ expense.Category }}</strong>
            <div class="text-muted">
              {{ expense.Description }}
            </div>
          </div>

          <div class="col-auto">
            {{ currency(expense.Amount) }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      error: null,
      months: []
    };
  },

  created() {
    fetch("https://ynab-savings-api-d7b9dchcc3g2dbbc.centralus-01.azurewebsites.net/api/savings-summary")
      .then(response => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        this.months = data;
      })
      .catch(error => {
        console.error(error);
        this.error = "Unable to load savings information.";
      })
      .finally(() => {
        this.loading = false;
      });
  },

  methods: {
    currency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);
    },

    signedCurrency(value) {
      const amount = this.currency(Math.abs(value));

      if (value > 0) return `+${amount}`;
      if (value < 0) return `-${amount}`;

      return amount;
    }
  }
};
</script>
