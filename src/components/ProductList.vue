<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6" md="6" v-for="product in products" :key="product.id">
                <v-card class="pa-4" @click="showDialog(product)">
                    <v-card-title class="headline">{{ product.name }}</v-card-title>
                    <v-img :src="product.image" height="200px"></v-img>
                    <p>{{ product.description }}</p>
                    <div>Price: {{ product.price }}</div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" @click="closeDialog">Buy</v-btn>
                    </v-card-actions>
                </v-card>

                <v-dialog v-model="dialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title class="headline">{{ selectedProduct.name }}</v-card-title>
                        <v-card-text>
                            <v-img :src="selectedProduct.image" height="200px"></v-img>
                            <p>{{ selectedProduct.description }}</p>
                            <div>Price: {{ selectedProduct.price }}</div>
                            <!-- More details here -->
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" @click="closeDialog">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            selectedProduct: {},
            products: [
                { id: 1, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" },
                { id: 2, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/images/cards/cooking.png" },
                { id: 3, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" },
                { id: 4, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/images/cards/cooking.png" },
                { id: 5, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" },
                { id: 6, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/images/cards/cooking.png" },
                { id: 7, name: 'Product 1', description: 'This is product 1', price: '€19.99', stock: 10, image: "https://cdn.vuetifyjs.com/images/cards/cooking.png" },
            ]
        }
    },
    methods: {
        showDialog(product) {
            this.selectedProduct = product;
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        }
    }
}
</script>