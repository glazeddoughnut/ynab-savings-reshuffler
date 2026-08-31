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
        :key="month.month"
        class="my-5"
      >
        <h2>{{ month.month }}</h2>

        <div class="d-flex justify-content-between mb-3">
          <span>
            Savings:
            {{ currency(month.startingBalance) }}
            →
            {{ currency(month.endingBalance) }}
          </span>

          <strong
            :class="month.change >= 0 ? 'text-success' : 'text-danger'"
          >
            {{ signedCurrency(month.change) }}
          </strong>
        </div>

        <div
          v-for="expense in month.expenses"
          :key="`${expense.date}-${expense.category}-${expense.amount}`"
          class="row border-top py-2"
        >
          <div class="col">
            <strong>{{ expense.category }}</strong>
            <div class="text-muted">
              {{ expense.description }}
            </div>
          </div>

          <div class="col-auto">
            {{ currency(expense.amount) }}
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
