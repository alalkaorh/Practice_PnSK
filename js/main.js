 Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
    
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p> {{ description }}</p>
            <p v-if="inStock">In stock</p>
            <p v-else>Out of Stock</p>
            <p>{{ sale }}</p>
            <span v-show="OnSile"</span>
            <product-details :details="details"></product-details>
            
        <ul>
            <li v-for="size in sizes">{{ size }}</li>
        </ul>
                  
    
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
                 <p>Delivery: {{ shipping }}</p>
                    <a href="https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks"> {{ link }}</a><br>
                <div class="cart">   
                   
                <button
                @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">
                Add to cart
                </button>

                <button v-on:click="removeToCart">Remove from cart</button>
                
                </div>
     

        </div>
    </div>
 `,
    data() {
        return {
            product: "Socks",
            description : "A pair of warm, fuzzy socks.",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "More products like this.",
            brand: 'Vue Mastery',
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{variantId: 2234, variantColor: 'green', variantImage: "./assets/vmSocks-green-onWhite.jpg", variantQuantity: 15}, 
                        {variantId: 2235, variantColor: 'blue', variantImage: "./assets/vmSocks-blue-onWhite.jpg", variantQuantity: 0}],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    
    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
         },
         deleteFormCart() {
            this.cart -=1
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
         },
         removeToCart() {
            this.$emit('remove-to-cart',this.variants[this.selectedVariant].variantId)
        }
      
         
         
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
            image() {
                return this.variants[this.selectedVariant].variantImage;
            },
            inStock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            shipping() { 
                if (this.premium) {
                    return "FREE";
                } else {
                    return 2.99
                }
            },
            sale() {
                if (this.onSale) {
                    return this.brand + ' ' + this.product + ' are on sale!'
                }
                return  this.brand + ' ' + this.product + ' are not on sale'
            }
         
        }

 })

 Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: false
        }
    },
    template:`
           <ul>
                <li v-for="detail in details">{{ detail }}</li>
           </ul>
      `
})


 let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
         updateProduct(variantImage) {
    this.image = variantImage

        },removeCart(id) {
            for (let i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }

    }
 })
 

 

 