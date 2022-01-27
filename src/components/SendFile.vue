<template>
  <div>
    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
    <textarea
      id="text"
      v-model="text"
      v-on:keypress.enter="sendText"
    ></textarea>
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

    handleFileUpload() {
      let file = this.$refs.file.files[0];
      let reader = new FileReader();

      reader.readAsText(file, "utf-8");

      reader.onload = () => {
        this.createFile(reader.result, file.name);
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
