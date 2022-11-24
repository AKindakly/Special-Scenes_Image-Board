import imageComments from "./image-comments.js";

const bigImage = {
    data() {
        return {
            image: null,
        };
    },
    props: ["imgId"],
    mounted() {
        // console.log("mounted");
        this.state = "mounted";
        fetch(`/images/${this.imgId}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                this.image = data;
            });
    },
    components: {
        "image-comments": imageComments,
    },
    methods: {
        triggerClose() {
            console.log("time to hide the component!");
            this.$emit("close");
        },
    },
    // how the component will render in HTML when it's shown.
    template: `
        <div class="imgComponentBigCont" v-if="image">
            <div class="imgComponentSmlCont">
                <h3 class="imgComponentTitle">{{ image.title }}</h3>
                <img
                    v-bind:src="image.url"
                    v-bind:id="image.id"
                    style="cursor: pointer"
                    @click="triggerClose"
                />
                <p class="imgComponentUsername">by: {{ image.username }}  -  created at: {{ image.created_at }} </p>

                <p class="imgComponentDescription">{{ image.description }}</p>

                <div>
                    <image-comments v-bind={"imgId":imgId}></image-comments>
                </div>
            </div>
        </div>
    `,
};

export default bigImage;
