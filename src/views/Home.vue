<template>
  <SendFile @file="sendToAllConnected" />
  <div v-for="computer in computers" :key="computer.ip">
    {{ computer.name }}
    <span
      @click="goToComputer(computer)"
      class="dot"
      :class="{ bgGreen: computer.connected, bgRed: !computer.connected }"
    ></span>
  </div>
</template>

<script>
import server from "../components/server";
import SendFile from "../components/SendFile.vue";

/** @typedef {import('../typings').Connection} Connection */
/** @typedef {import('../typings').Computer} Computer */

export default {
  name: "",
  components: { SendFile },
  data() {
    return {
      /** @type {Array<Computer>} */
      computers: [
        {
          name: "computer1",
          ip: "localhost:8080",
          connection: null,
          connected: false,
        },
        {
          name: "computer2",
          ip: "localhost:8081",
          connection: null,
          connected: false,
        },
        {
          name: "computer3",
          ip: "localhost:8082",
          connection: null,
          connected: true,
        },
        {
          name: "computer4",
          ip: "localhost:8083",
          connection: null,
          connected: false,
        },
        {
          name: "computer5",
          ip: "localhost:8084",
          connection: null,
          connected: false,
        },
      ],
    };
  },
  methods: {
    /** @param {Array<Connection>} connections */
    onConnectionChange(connections) {
      for (const computer of this.computers) {
        computer.connected = false;
        for (const connection of connections) {
          if (computer.name == connection.name) {
            computer.ip = connection.ip;
            computer.connected = true;
            computer.connection = connection;
            break;
          }
        }
      }
    },
    /** @param {{ filename: string, text: string }} file */
    sendToAllConnected(file) {
      for (const computer of this.computers) {
        if (!computer.connected) {
          continue;
        }
        try {
          console.log(file);
          computer.connection.connection.send(JSON.stringify(file));
        } catch (e) {
          console.error(e);
        }
      }
    },

    /** @param {Computer} computer 

    */
    goToComputer(computer) {

      if (computer.connected) {
        this.$router.push({
          path: "/computer",
          props: { ip: computer.ip, name: computer.name },
          params: { ip: computer.ip, name: computer.name },
          query: { ip: computer.ip, name: computer.name },
        });
      }
    },

    //onMatlabMessage(data) {
    //  data;
    //},
  },
  mounted() {
    this.onConnectionChange([]);
    server.bindConnectionsListener(this.onConnectionChange);
    // server.bindMessageListener(this.onMatlabMessage);
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
