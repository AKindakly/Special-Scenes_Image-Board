import * as Vue from "./vue.js";
import bigImage from "./big-image.js";

Vue.createApp({
    data() {
        return {
            heading: "Special Scenes",
        };
    },
}).mount("#heading");

//////////////////////////////////////////////////////////////////////////////////////////////

Vue.createApp({
    data() {
        return {
            imgPara: "Latest Images",
            message: "",
            images: [],
            imageId: null,
        };
    },
    components: {
        "big-image": bigImage,
    },
    methods: {
        showImage(e) {
            // console.log(e.currentTarget.id);
            // console.log(e);
            this.imageId = e.currentTarget.id;
            history.pushState(
                { cards: this.imageId },
                "",
                `/image/${this.imageId}`
            );
            // window.addEventListener("popstate", function (e) {
            //     myFunction(e.state.key);
            // });
        },
        closeImage() {
            this.imageId = null;
            history.pushState({ cards: this.imageId }, "", "/");
        },
        upload(e) {
            const form = e.currentTarget;
            const fileInput = form.querySelector("input[type=file]");
            // console.log(fileInput.files);

            if (fileInput.files.length < 1) {
                this.message = "You must first select an image!";
                return;
            }

            const myFormData = new FormData(form);

            fetch("/images", {
                method: "post",
                body: myFormData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message) {
                        this.mesage = data.message;
                    }
                    if (data.success) {
                        console.log("my data:", data);
                        this.images.unshift(data);
                    }
                });
        },
    },
    mounted() {
        fetch("/images")
            .then((res) => res.json())
            .then((rows) => {
                // console.log(rows);
                this.images = rows;
            });
    },
}).mount("#main");
