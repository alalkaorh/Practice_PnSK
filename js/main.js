Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
 <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>
 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>

    
  `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null

            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
})


Vue.component('product', {
    template: `
   <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText" />
            </div>
            <div class="product-info">
                <h1>{{ sale }}</h1>
                <p>{{ description  }}</p>
                 <detail-tabs :shipping="shipping" :details="details"></detail-tabs>
                <p v-if="variants[this.selectedVariant].variantQuantity > 10">In stock</p>
                <p v-else-if="variants[this.selectedVariant].variantQuantity <= 10 && variants[this.selectedVariant].variantQuantity > 0">Almost sold out!</p>
                <p v-else :class="{ out_of_stock: !inStock }">Out of stock</p>
                <a :href="link">More products like this</a>
                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @mouseover="updateProduct(index)"
                >
                </div>
                <ul>
                    <li v-for="size in sizes" :key="sizes">{{size}}</li>
                </ul>
                 <button @click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to cart</button>
                <button @click="removeFromCart">Remove from cart</button><br>
                
                  <product-tabs :reviews="reviews"></product-tabs>
                    </div>
        </div>
 `,
//  <h2>Reviews</h2> между 136/137
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks.",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 15
            },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    props: {
        premium: {
            type: Boolean,
            required: true
        },
    },
    cart: {
        type: Number
    },


    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        removeToCart() {
            this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }


    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
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
            return this.brand + ' ' + this.product + ' are not on sale'
        },


    }

})


Vue.component('product-details', {
    props: {
        details: {
            type: Array,
        }
    },
    template: `
           <ul>
                <li v-for="detail in details">{{ detail }}</li>
           </ul>
      `
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: false
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
      
        <ul>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Shipping'">
          
        </div>
        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})

Vue.component('product-tabs', {
    template: `
    <div>   
    <ul>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            @click="selectedTab = tab"
      >{{ tab }}</span>
    </ul>
    <div v-show="selectedTab === 'Reviews'">
       <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
           <p>Name: {{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>Review: {{ review.review }}</p>
           <p>Radio: {{ review.radio }}</p>
        </li>
      </ul>
    </div>
    <div v-show="selectedTab === 'Make a Review'">
     <product-review></product-review>
    </div>
    <div v-show="selectedTab === 'Shipping'">
         <p>Shipping: {{ shipping }}</p>
     </div>
     <div v-show="selectedTab === 'Details'">
         <product-details/>
     </div>
  </div>
    `,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },

    props: {
        reviews: {
            type: Array,
            required: false
        },
        premium: {
            type: Boolean,
            required: true

        }
    },
    computed: {
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
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
        removeCart() {
            this.cart.pop();
        },


    }
})
 
 

 

 