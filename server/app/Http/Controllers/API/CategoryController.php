<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Log as CategoryLog;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allCategories = Category::orderBy('created_at', 'desc')->get();

        if ($allCategories->count() > 0) {
            return response()->json([
                'status'                =>              true,
                'message'               =>              "Successfully fetch all categories data",
                'data'                  =>              $allCategories
            ], 200);
        } else {
            return response()->json([
                'status'                =>              false,
                'message'               =>              "No categories found.",
            ], 200);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'category_name'         =>              ['required', 'max:5000', 'unique:categories,category_name']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'                =>          false,
                'message'               =>          'Something went wrong. Please fix.',
                'errors'                =>          $validation->errors()
            ], 422);
        }


        $category = Category::create([
            'category_name'          =>          $request->category_name
        ]);

        CategoryLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Added a category: ' . $category->category_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $category->category_name . " category added successfully.",
            'data'                  =>              $category,
            'id'                    =>              $category->id
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Category not found.'
            ], 404);
        }

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Category fetched successfully.',
            'category'              =>              $category
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        $validation = Validator::make($request->all(), [
            'category_name'           =>              ['required', 'unique:categories,category_name,' . $category->id],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Something went wrong. Please fix.',
                'errors'        =>          $validation->errors()
            ], 422);
        }

        if (!$category) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Category not found.'
            ], 404);
        }

        $oldCategoryName = $category->category_name;

        $category->update([
            'category_name'           =>              $request->category_name
        ]);

        CategoryLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Updated a category from: ' . $oldCategoryName . ' to: ' . $category->category_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $category->category_name . ' category updated successfully.',
            'id'                    =>              $category->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'Category  not found.'
            ], 404);
        }

        $units = $category->units()->count();

        if ($units > 0) {
            return response()->json([
                'status'                =>              false,
                'message'               =>              'You cannot delete a category that is already in used by units.'
            ], 422);
        }

        CategoryLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Deleted the category : ' . $category->category_name
        ]);

        $category->delete();

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Category  deleted successfully.'
        ], 200);
    }
}
