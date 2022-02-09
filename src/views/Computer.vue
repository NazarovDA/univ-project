<template>
  <div>
    <!--{{ computer.name }}-->
    <SendFile @file="sendToComputer" />
  </div>

  <div class="messages">
    <ol>
      <li v-for="message in messages" :key="message.id">
        {{ message.data }}
      </li>
    </ol>
  </div>
</template>

<script>
import SendFile from "../components/SendFile.vue";
import server from "../components/server";

/** @typedef {import('../typings').ClientMessage} ClientMessage */
/** @typedef {import('../typings').Computer} Computer */

export default {
  name: "Computer",
  components: { SendFile },
  props: {
    /** @type {Computer} */
    ip: () => true,
  },
  params: {},
  query: {
    /** @type {String} */
    ip: () => true,
    /** @type {String} */
    name: () => true,
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    /** @param {{ filename: string, text: string }} file */
    sendToComputer(file) {
      try {
        const connection = server.getConnection(
          this.$route.query.ip,
          this.$route.query.name
        );
        connection.connection.send(JSON.stringify(file));
      } catch (e) {
        console.error(e);
      }
    },
    /**
     *@param {ClientMessage} message
     */
    messageListener(message) {
      const id = this.messages.length;
      this.messages.push({
        id,
        data: message.matlabInfo,
      });
    },
  },

  created() {
    console.log("query", this.$route.query);
  },
  mounted() {
    const connection = server.getConnection(
      this.$route.query.ip,
      this.$route.query.name
    );
    connection.messageListener = this.messageListener;
  },
};
</script>

<style></style>
