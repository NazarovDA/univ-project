<template>
  <div v-for="computer in computers" :key="computer.ip">
    {{ computer.name }}
    <span
      class="dot"
      :class="{ bgGreen: computer.connected, bgRed: !computer.connected }"
    ></span>
  </div>
</template>

<script>
import server from "../components/server";
export default {
  name: "",
  data() {
    return {
      computers: [
        { name: "computer1", ip: "localhost:8080", connected: false },
        { name: "computer2", ip: "localhost:8081", connected: false },
        { name: "computer3", ip: "localhost:8082", connected: true },
        { name: "computer4", ip: "localhost:8083", connected: false },
        { name: "computer5", ip: "localhost:8084", connected: false },
      ],
    };
  },
  methods: {
    onConnectionChange(connections) {
      for (const computer of this.computers) {
        computer.connected = false;
        for (const connection of connections) {
          if (computer.name == connection.name) {
            computer.ip = connection.ip;
            computer.connected = true;
            break;
          }
        }
      }
    },
    sendToConnected(connections) {
      connections;
    },
    onMatlabMessage(data) {
      data;
    },
  },
  mounted() {
    this.onConnectionChange([]);
    server.bindConnectionsListener(this.onConnectionChange);
    server.bindMessageListener(this.onMatlabMessage);
  },
};
</script>

<style>
.dot {
  position: relative;
  top: 1px;
  border-radius: 69%;
  width: 0.8rem;
  height: 0.8rem;
  display: inline-block;
}
.bgGreen {
  background: #00ff00;
}
.bgRed {
  background: #ff0000;
}
</style>
