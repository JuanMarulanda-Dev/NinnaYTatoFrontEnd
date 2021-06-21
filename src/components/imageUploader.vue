<template>
  <div>
    <!-- slot for parent component to activate the file changer -->
    <div @click="launchFilePicker()">
      <slot name="activator"></slot>
    </div>
    <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
    <input
      type="file"
      ref="file"
      :name="uploadFieldName"
      @change="onFileChange($event.target.files)"
      style="display: none"
    />
  </div>
</template>

<script>
export default {
  name: "image-input",
  data: () => ({
    uploadFieldName: "file",
    maxSize: 3024,
  }),
  props: {
    // Use "value" to enable using v-model
    value: Object,
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(file) {
      const { maxSize } = this;
      let imageFile = file[0];
      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          // check whether the upload is an image
          this.$toast.warning("Por favor selecciona una imagen.");
        } else if (size > 5) {
          // check whether the size is greater than the size limit
          this.$toast.warning(
            "Tu archivo es demasiado grande! Por favor selecciona una imagen de 3MB o inferior."
          );
        } else {
          // Append file into FormData and turn file into image URL
          let imageURL = URL.createObjectURL(imageFile);
          // Emit the FormData and image URL to the parent component
          this.$emit("input", { imageFile, imageURL });
        }
      }
    },
  },
};
</script>
