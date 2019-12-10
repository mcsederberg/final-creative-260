/*global Vue*/
/*global axios*/
var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    file: null,
    price: "",
    products: [],
    findTitle: "",
    findProduct: null,
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async deleteProduct(product) {
      try {
        let response = axios.delete("/api/products/" + product._id);
        this.findProduct = null;
        this.getProducts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editProduct(product) {
      try {
        let response = await axios.put("/api/products/" + product._id, {
          title: this.findProduct.title,
        });
        this.findProduct = null;
        this.findProducts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/products', {
          title: this.title,
          price: this.price,
          path: r1.data.path,
          orders: 0
        });
        this.getProducts();
      } catch (error) {
        console.log(error);
      }
    },
    async getProducts() {
      try {
        let response = await axios.get("/api/products");
        var products = response.data;
        products.sort((a, b) => (a.title > b.title) ? 1 : -1)
        this.products = products;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getProducts();
  },
});
