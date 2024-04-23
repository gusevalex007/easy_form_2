<template>
    <v-container>
        <v-btn color="primary" @click="takePhoto">Take Photo</v-btn>
        <v-img :src="photo" aspect-ratio="1.6"></v-img>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            photo: null,
        };
    },
    methods: {
        async takePhoto() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Wait for the video to be ready
                await new Promise((resolve) => (video.onloadedmetadata = resolve));

                // Capture the photo
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                this.photo = canvas.toDataURL('image/png');

                // Stop all video streams
                stream.getVideoTracks().forEach(track => track.stop());
            } catch (error) {
                console.error('Error capturing photo:', error);
            }
        },
    },
};
</script>