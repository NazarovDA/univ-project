<template>
  <div>
    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
    <textarea
      id="text"
      v-model="text"
      @keydown.ctrl.enter="sendText"
      rows="15"
      cols="50"
    ></textarea>
    <button @click="clearText()">clear field</button>
    <button @click="send()">send data from field</button>
  </div>
</template>

<script>
export default {
  emits: { file: () => true },
  data: () => {
    return {
      text: "",
    };
  },
  methods: {
    /**
     * @param {string} text
     * @param {string} [filename]
     */
    createFile(text, filename = "data.m") {
      this.$emit("file", {
        filename: filename,
        text: text,
      });
    },

    clearText() {
      this.text = "";
    },

    send() {
      this.createFile(this.text);
    },

    handleFileUpload() {
      let file = this.$refs.file.files[0];
      let reader = new FileReader();

      reader.readAsText(file, "utf-8");

      reader.onload = () => {
        //this.createFile(reader.result, file.name);
        this.text = reader.result;
      };
      reader.onerror = console.error;
    },
    sendText() {
      console.log(this.text);
      this.createFile(this.text);
    },
  },
};
</script>

<style scoped></style>
