const imageComments = {
    data() {
        return {
            username: null,
            comment: null,
            comments: null,
        };
    },
    props: ["imgId"],
    mounted() {
        // console.log("mounted");
        this.state = "mounted";
        fetch(`/images/comments/${this.imgId}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                this.comments = data;
            });
    },
    methods: {
        uploadComment() {
            const commentData = {
                imageId: this.imgId,
                username: this.username,
                comment: this.comment,
            };
            console.log("my comment data in img-c: ", commentData);
            fetch("/images/comments", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentData), // <-- care here
            })
                .then((result) => result.json())
                .then((data) => {
                    this.comments.unshift(data);
                });
        },
    },
    template: `
        <div class="commentsCont">
            <h3>Add a comment!</h3>
            <form
                action="/images/comments"
                method="post"
                @submit.prevent="uploadComment"
            >
                <label for="c-username">username</label>
                <input
                    type="text"
                    name="c-username"
                    id="username"
                    v-model="username"
                    maxlength="35"
                    required
                    style="width: 35%"
                />

                <label for="comment">comment</label>
                <input
                    type="text"
                    name="comment"
                    v-model="comment"
                    required
                    style="padding-bottom: 25px"
                />

                <input
                    class="commentsBtn"
                    type="submit"
                    value="add comment"
                />
            </form>
            <div class="comments" v-for="comment in comments">
                <p style="margin-bottom: 10px; font-size: 15px">
                    by: {{ comment.username}}
                </p>
                <p>{{ comment.comment}}</p>
            </div>
        </div>
    `,
};

export default imageComments;
