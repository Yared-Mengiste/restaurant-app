<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $pizzaCategory = Category::create(['name' => 'Pizza']);
        $burgerCategory = Category::create(['name' => 'Burger']);
        $drinkCategory = Category::create(['name' => 'Drinks']);

        /*
        |--------------------------------------------------------------------------
        | PIZZAS (WITH VARIANTS)
        |--------------------------------------------------------------------------
        */

        $pizza = Product::create([
            'category_id' => $pizzaCategory->id,
            'name' => 'Margherita Pizza',
            'description' => 'Classic cheese pizza',
            'price' => 250, // default = medium
            'has_variants' => true,
            'is_featured' => true,
            'is_available' => true,
        ]);

        ProductVariant::insert([
            [
                'product_id' => $pizza->id,
                'name' => '6 inch',
                'price' => 150,
            ],
            [
                'product_id' => $pizza->id,
                'name' => '9 inch',
                'price' => 250,
            ],
            [
                'product_id' => $pizza->id,
                'name' => '12 inch',
                'price' => 350,
            ],
        ]);

        $pepperoni = Product::create([
            'category_id' => $pizzaCategory->id,
            'name' => 'Pepperoni Pizza',
            'description' => 'Pepperoni with cheese',
            'price' => 300,
            'has_variants' => true,
            'is_featured' => true,
            'is_available' => true,
        ]);

        ProductVariant::insert([
            ['product_id' => $pepperoni->id, 'name' => '6 inch', 'price' => 180],
            ['product_id' => $pepperoni->id, 'name' => '9 inch', 'price' => 300],
            ['product_id' => $pepperoni->id, 'name' => '12 inch', 'price' => 420],
        ]);

        /*
        |--------------------------------------------------------------------------
        | BURGERS (NO VARIANTS)
        |--------------------------------------------------------------------------
        */

        Product::insert([
            [
                'category_id' => $burgerCategory->id,
                'name' => 'Cheese Burger',
                'description' => 'Beef burger with cheese',
                'price' => 180,
                'has_variants' => false,
                'is_featured' => true,
                'is_available' => true,
            ],
            [
                'category_id' => $burgerCategory->id,
                'name' => 'Chicken Burger',
                'description' => 'Grilled chicken burger',
                'price' => 160,
                'has_variants' => false,
                'is_featured' => false,
                'is_available' => true,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | DRINKS (NO VARIANTS)
        |--------------------------------------------------------------------------
        */

        Product::insert([
            [
                'category_id' => $drinkCategory->id,
                'name' => 'Coca Cola',
                'description' => 'Cold drink',
                'price' => 50,
                'has_variants' => false,
                'is_featured' => true,
                'is_available' => true,
            ],
            [
                'category_id' => $drinkCategory->id,
                'name' => 'Orange Juice',
                'description' => 'Fresh juice',
                'price' => 70,
                'has_variants' => false,
                'is_featured' => false,
                'is_available' => true,
            ],
        ]);
    }
}
