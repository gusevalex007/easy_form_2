<template>

    <div>
        <v-card class="mx-auto" max-width="400">
            <v-img color="surface-variant" height="200"
                src="https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" cover>
                <v-toolbar color="transparent" dark>
                    <template v-slot:prepend>
                        <!-- <v-btn icon="$menu"></v-btn> -->
                        <v-app-bar-nav-icon></v-app-bar-nav-icon>
                    </template>

                    <v-toolbar-title class="text-h6" text="Messages"></v-toolbar-title>

                    <template v-slot:append>
                        <v-btn icon="mdi-dots-vertical"></v-btn>
                    </template>
                </v-toolbar>
            </v-img>

            <v-card-text>
                <div class="font-weight-bold ms-1 mb-2">Today</div>

                <v-timeline align="start" density="compact">
                    <v-timeline-item v-for="message in messages" :key="message.time" :dot-color="message.color"
                        size="x-small">
                        <div class="mb-4">
                            <div class="font-weight-normal">
                                <strong>{{ message.from }}</strong> @{{ message.time }}
                            </div>

                            <div>{{ message.message }}</div>
                        </div>
                    </v-timeline-item>
                </v-timeline>
            </v-card-text>
        </v-card>


        <v-card class="mx-auto" max-width="400">
            <v-img class="align-end text-white" height="200" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                cover>
                <v-card-title>Top 10 Australian beaches</v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
                Number 10
            </v-card-subtitle>

            <v-card-text>
                <div>Whitehaven Beach</div>

                <div>Whitsunday Island, Whitsunday Islands</div>
            </v-card-text>

            <v-card-actions>
                <v-btn color="orange" text="Share"></v-btn>

                <v-btn color="orange" text="Explore"></v-btn>
            </v-card-actions>
        </v-card>
    </div>



</template>


<script>
export default {
    data: () => ({
        messages: [
            {
                from: 'You',
                message: `Sure, I'll see you later.`,
                time: '10:42am',
                color: 'deep-purple-lighten-1',
            },
            {
                from: 'John Doe',
                message: 'Yeah, sure. Does 1:00pm work?',
                time: '10:37am',
                color: 'green',
            },
            {
                from: 'You',
                message: 'Did you still want to grab lunch today?',
                time: '9:47am',
                color: 'deep-purple-lighten-1',
            },
        ],
    }),
}
</script>