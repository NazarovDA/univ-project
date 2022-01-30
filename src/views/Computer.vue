<template>
  <div>
    <!--{{ computer.name }}-->
    <SendFile @file="sendToComputer" />
  </div>
</template>

<script>
import SendFile from "../components/SendFile.vue";
import server from "../components/server";

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
    return {};
  },
  methods: {
    /** @param {{ filename: string, text: string }} file */
    sendToComputer(file) {
      try {
        this.computer.connection.send(JSON.stringify(file));
      } catch (e) {
        console.error(e);
      }
    },

    messageListener() {},
  },

  created() {
    console.log("query", this.$route.query);
  },

  mounted() {
    console.log(this);
    server.bindMessageListener(this.messageListener);
  },
};
</script>

<style></style>
