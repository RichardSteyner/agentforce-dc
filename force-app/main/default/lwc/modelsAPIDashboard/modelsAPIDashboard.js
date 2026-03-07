import { LightningElement, track } from "lwc";
import createChatGenerations from "@salesforce/apex/DashboardController.createChatGenerations";

export default class HousingMarket extends LightningElement {
  @track housingData = [];
  @track isLoading = false;
  @track error;
  @track messages = []; // Initialize messages

  connectedCallback() {
    this.fetchHousingMarketData();
  }

  // Get Housing Market Data
  fetchHousingMarketData() {
    this.isLoading = true;
    createChatGenerations()
      .then((result) => {
        console.log(result);
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.housingData = [];
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Handle analyze button click
  handleSendMessage() {
    this.isLoading = true; // Show loading indicator

    // Call Apex method to fetch chat response
    createChatGenerations()
      .then((result) => {
        const assistantMessageObj = {
          id: this.messages.length + 1,
          text: result,
          role: "assistant",
          isUser: false,
        };
        this.messages = [...this.messages, assistantMessageObj]; // Add assistant message to messages array
      })
      .catch((error) => {
        console.error("Error fetching bot response", JSON.stringify(error));
      })
      .finally(() => {
        this.isLoading = false; // Hide loading indicator
      });
  }
}