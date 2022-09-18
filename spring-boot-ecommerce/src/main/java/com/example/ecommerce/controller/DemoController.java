package com.example.ecommerce.controller;

import com.example.ecommerce.dto.Purchase;
import com.example.ecommerce.dto.PurchaseResponse;
import com.example.ecommerce.entity.Country;
import com.example.ecommerce.entity.State;
import com.example.ecommerce.repo.CountryRepository;
import com.example.ecommerce.repo.ProductCategoryRepository;
import com.example.ecommerce.repo.ProductRepository;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductCategory;
import com.example.ecommerce.repo.StateRepository;
import com.example.ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class DemoController {

    @Autowired
    private ProductCategoryRepository productCategoryRepo;
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private CountryRepository countryRepo;
    @Autowired
    private StateRepository stateRepo;
    @Autowired
    private CheckoutService checkoutService;


    @GetMapping("/product-category")
    public ResponseEntity<List<ProductCategory>> getAllProducts() {
        System.out.println("Hello");
        List<ProductCategory> productCategories = productCategoryRepo.findAll();
        return new ResponseEntity<>(productCategories, HttpStatus.OK);
    }

    @GetMapping("/search-product")
    public Page<Product> getSearchProducts(@RequestParam("name") String name, Pageable pageable) {
        Page<Product> products = productRepo.findByNameContaining(name, pageable);
        return products;
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductDetail(@PathVariable Long id) {
        Product myProduct = productRepo.findById(id).get();
        System.out.println(myProduct);
        return new ResponseEntity<>(myProduct, HttpStatus.OK);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllOfProducts(){
        return new ResponseEntity<>(productRepo.findAll(),HttpStatus.OK);
    }

    @GetMapping("/products/search-category")
    public ResponseEntity<Page<Product>> getProductByCategory(@RequestParam("id") Long id, Pageable pageable){
        return new ResponseEntity<>(productRepo.findByCategoryId(id, pageable), HttpStatus.OK);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        return new ResponseEntity<>(countryRepo.findAll(),HttpStatus.OK);
    }

    @GetMapping("/states/countryCode")
    public ResponseEntity<List<State>> getByCountryCode(@RequestParam("code") String code) {
        return new ResponseEntity<>(stateRepo.findByCountryCode(code),HttpStatus.OK);
    }

    @PostMapping("/checkout/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        System.out.println("Hello");
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }


}
