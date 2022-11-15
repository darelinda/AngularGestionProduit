import { Component, OnInit } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products! : Array<Product>;
  errosMessage! : string;
  //creer un formulaire de type FormGroup
  searchFormGroup! : FormGroup;

  currentPage : number=0;

  pageSize:number=5;

  totalPages : number =0;

  currentAction : String="all";


  constructor(private productService : ProductService, private fb : FormBuilder) { }

  ngOnInit(): void {
    //creer ce formGroup
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control(null)
    });
    this.handleGetPageProduct();
  }
  handleDeleteProduct(p: Product) {
    let conf=confirm("Are you sure?");
    if(conf==false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : (data)=>{
        let index = this.products.indexOf(p);
         //pour supprimer l'element du tableau
        this.products.splice(index, 1);
        //this.handleGetAllProduct();
      }
    })

  }

  handleGetPageProduct(){
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next : (data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
      },
      error : (err)=>{
        this.errosMessage=err;
      }
  })
  }

  handleGetAllProduct(){
    this.productService.getAllProducts().subscribe(
      {
        next : (data)=>{
          this.products=data;
        },
        error : (err)=>{
          this.errosMessage=err;
        }
      });
  }

  handleSetPromotion(p: Product) {
    let promo=p.promotion
     this.productService.setPromotion(p.id).subscribe({
      next : (data)=>{
        p.promotion=!promo;
      },
      error : err =>{
        this.errosMessage=err;
      }
     })
  }

  handleSearchProducts(){
    this.currentAction="search";
    this.currentPage=0;
    let keyword=this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe(
      {
        next : (data)=>{
          this.products=data.products;
          this.totalPages=data.totalPages;
        }
      })
  }

  gotoPage(i: number){
    this.currentPage=i;
    if(this.currentAction==="all")
      this.handleGetPageProduct();
    else
      this.handleSearchProducts();
  }

}
