import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup; 
  totalQuantity: number = 0;
  totalPrice: number = 0; 

  creditCardYears: number[] = [];
  creditCardMonths: number[] = []; 

  countries: Country[] = [];
  states: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService: FormService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void { 


    this.reviewCartDetails();

    this.checkoutForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]),
        lastName:  new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }), 
      shippingAddress : this.formBuilder.group({
        street:  new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]), 
        state: new FormControl('',[Validators.required]), 
        country: new FormControl('',[Validators.required]), 
        zipCode:  new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace])
      }),  
      billingAddress : this.formBuilder.group({
        street:  new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]), 
        state: new FormControl('',[Validators.required]), 
        country: new FormControl('',[Validators.required]), 
        zipCode:  new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace])
      }), 
      creditCard : this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]), 
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), CustomValidators.hasWhitespace]), 
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]), 
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]), 
        expirationMonth: [''], 
        expirationYear: ['']
      })

    }); 

    this.formService.getCreditCardMonths().subscribe(
      data => {
        console.log("months: "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Years : "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.formService.getCountries().subscribe( 
      data => {
        console.log("Retrieved Countries "+ JSON.stringify(data)); 
        this.countries = data;
      }
    );
  } 

  reviewCartDetails() {
    
    this.cartService.totalQuantity.subscribe( 
      totalQuantity => this.totalQuantity = totalQuantity 
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  get firstName() { return this.checkoutForm.get('customer.firstName'); } 
  get lastName() { return this.checkoutForm.get('customer.lastName'); }
  get email() { return this.checkoutForm.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutForm.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutForm.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutForm.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutForm.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutForm.get('shippingAddress.country'); } 

  get billingAddressStreet() { return this.checkoutForm.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutForm.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutForm.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutForm.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutForm.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutForm.get('creditCard.cardType'); } 
  get creditCardNameOnCard() { return this.checkoutForm.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutForm.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutForm.get('creditCard.securityCode'); }



  
  
  
  getStates(groupName: string) {
    const formGroup = this.checkoutForm.get(groupName);
    const countryCode = formGroup.value.country.code; 
    const countryName = formGroup.value.country.name;

    console.log("Country code: "+ countryCode); 
    console.log("Country name: "+ countryName);

    this.formService.getStates(countryCode).subscribe(
      data => {
        this.states = data; 
        console.log(data);
      }
    )

  }

  onSubmit() {
    console.log("Handling the submit button"); 

    if(this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    } 

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity; 

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = [];
    
    for(let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    } 


    let purchase = new Purchase(); 
    purchase.customer = this.checkoutForm.controls['customer'].value;
    purchase.shippingAddress = this.checkoutForm.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state)); 
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)); 
    purchase.shippingAddress.state = shippingState.name; 
    purchase.shippingAddress.country = shippingCountry.name; 

    purchase.billingAddress = this.checkoutForm.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state)); 
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country)); 
    purchase.billingAddress.state = billingState.name; 
    purchase.billingAddress.country = billingCountry.name; 

    purchase.order = order;
    purchase.orderItems = orderItems; 

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been recieved.\nOrder tracking number: ${response.orderTrackingNumber}`); 
          this.resetCart();
        }, 
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )


  }
  resetCart() { 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0); 

    this.checkoutForm.reset(); 

    this.router.navigateByUrl("/products");
  }

}
