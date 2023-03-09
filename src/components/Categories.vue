<template>
  <div class="container">
    <h5>Categories</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Location</th>
          <th>Checking</th>
          <th>Savings on Budget</th>
          <th>Savings off Budget</th>
          <th>Total Savings</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody v-for="category_group in category_groups" v-bind:key="category_group.id">
        <!-- <tr>
          <td>{{ category_group.name }}</td>
          <td></td>
          <td>{{ convertMilliUnitsToCurrencyAmount(category_group.categories.reduce((acc, item) => acc + item.balance,
            0)).toFixed(2) }}</td>
        </tr> -->
        <!-- <tr v-for="category in category_group.categories" v-bind:key="category.id">
        <td></td>
        <td>{{category.name}}</td>
        <td>{{convertMilliUnitsToCurrencyAmount(category.balance).toFixed(2)}}</td>
      </tr> -->
      </tbody>
      <tr>
        <td>Budget</td>
        <td style="background-color: lightgray">{{ convertAmount(totalChecking) }}</td>
        <td style="background-color: lightgray">{{ convertAmount(totalSavings) }}</td>
        <td></td>
        <td></td>
        <td style="background-color: lightgray">{{ convertAmount(totalRequest) }}</td>
      </tr>
      <tr>
        <td>Accounts</td>
        <td>{{ convertAmount(totalCheckingAccount) }}</td>
        <td style="background-color: lightgray">{{ convertAmount(totalSavingsBudgetAccount) }}</td>
        <td style="background-color: lightgray">{{ convertAmount(totalSavingsTrackingAccount) }}</td>
        <td style="background-color: lightgray">{{ convertAmount(totalSavingsBudgetAccount+totalSavingsTrackingAccount) }}</td>
        <td>{{ convertAmount(totalCheckingAccount + totalSavingsBudgetAccount+totalSavingsTrackingAccount) }}</td>
      </tr>
      <tr>
        <td>Difference</td>
        <td>{{ convertAmount(totalCheckingAccount-totalChecking) }}</td>
        <td>{{ convertAmount(totalSavingsBudgetAccount-totalSavings) }}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>

    <h4 v-if="totalCheckingAccount-totalChecking < 0">Please move {{ convertAmount(totalChecking-totalCheckingAccount) }} from savings to checking at the bank to cover all budgeted amounts.</h4>
    <h4 v-if="totalChecking-totalCheckingAccount < 0">Please move {{ convertAmount(totalCheckingAccount-totalChecking) }} from checking to savings at the bank to earn more interest.</h4>
  </div>
</template>

<script>
// Import utils from YNAB
import { utils } from 'ynab';

export default {
  props: ['category_groups', 'accounts'],
  methods: {
    // Now we can make this method available to our template
    // So we can format this milliunits in the correct currency format
    convertAmount: (amt) => utils.convertMilliUnitsToCurrencyAmount(amt).toFixed(2)
  },
  computed: {
    totalRequest() {
      let total = 0;
      let process = true;
      this.category_groups.forEach(group => {
        if (group.name === "==Below Is Not Checking==") {
          process = false;
        }
        if (group.name === "==Below is Savings==") {
          process = true;
        }
        if (process) {
          if (group.hidden === false && group.name !== "Internal Master Category") {
            total += group.categories.reduce((ac, cat) => ac + cat.balance, 0);
          }
        }
      });
      return total;
    },
    totalChecking() {
      let total = 0;
      let process = true;
      this.category_groups.forEach(group => {
        if (group.name === "==Below Is Not Checking==") {
          process = false;
        }
        if (process) {
          if (group.hidden === false && group.name !== "Internal Master Category") {
            total += group.categories.reduce((ac, cat) => ac + cat.balance, 0);
          }
        }
      });
      return total;
    },
    totalSavings() {
      let total = 0;
      let process = false;
      this.category_groups.forEach(group => {
        if (group.name === "==Below is Savings==") {
          process = true;
        }
        if (process) {
          if (group.hidden === false && group.name !== "Internal Master Category") {
            total += group.categories.reduce((ac, cat) => ac + cat.balance, 0);
          }
        }
      });
      return total;
    },
    totalCheckingAccount() {
      console.log(this.accounts);
      var total = this.accounts.find((item) => item.name === "Affinity checking").balance;
      return total;
    },
    totalSavingsBudgetAccount() {
      var total = this.accounts.find((item) => item.name === "Affinity MM Budget").balance;
      return total;
    },
    totalSavingsTrackingAccount() {
      var total = this.accounts.find((item) => item.name === "Affinity MM Tracking").balance;
      return total;
    }
  }
}
</script>
