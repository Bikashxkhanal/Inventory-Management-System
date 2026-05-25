<?php
return [
    'roles' => [
        'superadmin' => 
            [
            'DASHBOARD',
            'VIEW_USER',
            'CREATE_USER',
            'CREATE_VENDOR',
            'DELETE_USER',
            'DELETE_VENDOR',
            'GENERATE_REPORT',
            'VIEW_REPORT',
            'VIEW_STOCK',
            'ADD_PRODUCT',
            'DELETE_PRODUCT',
            'CREATE_PURCHASE',
            'UPDATE_PURCHASE',
            'DELETE_PURCHASE',
            'VERIFY_PURCHASE',
            'VIEW_VENDOR',
            'CREATE_VENDOR',
            'UPDATE_VENDOR',
            'DELETE_VENDOR',
    
        ],
        'admin' => [
            'DASHBOARD',
             'VIEW_USER',
             'CREATE_USER',
             'GENERATE_REPORT',
             'VIEW_REPORT',
             'VIEW_STOCK',
              'ADD_PRODUCT',
            'DELETE_PRODUCT',
            'CREATE_PURCHASE',
            'UPDATE_PURCHASE',
            'DELETE_PURCHASE',
            'VERIFY_PURCHASE',
            'VIEW_VENDOR',
            'CREATE_VENDOR',
            'UPDATE_VENDOR',
            'DELETE_VENDOR',

        ],
        'manager' => [
            'DASHBOARD',
            'GENERATE_REPORT',
             'VIEW_REPORT',
             'REVERSE_SALE',
             'VIEW_STOCK',
             'CREATE_PURCHASE',
             'CREATE_USER',
             'VIEW_USER',
             'VIEW_VENDOR',
             'CREATE_VENDOR',
             'ADD_PRODUCT',
        ],
        'salesperson' => [
            'CREATE_SALE',
            'VIEW_STOCK'

        ]
    ],

    'permissions' => [
        'CREATE_USER' => 'can create  user',
        'DELETE_USER' => 'can delete user',
        'CREATE_VENDOR' => 'can create vendor',
        'DELETE_VENDOR' => 'can delete vendor',
        'CREATE_PO' => 'can create po',
        'GENERATE_REPORT' => 'can generate report', 
        'VIEW_REPORT' => 'can view reports',
        'CREATE_SALE' => 'can make a sale', 
        'REVERSE_SALE' => 'can reverse a sale',
        'VIEW_STOCK' => 'can view the stock quantity',
        'CREATE_PURCHASE' => 'can create purchase',
        'UPDATE_PURCHASE' => 'can update purchase',
        'DELETE_PURCHASE' => 'can delete purchase',
        'VERIFY_PURCHASE' => 'can verify draft purchase',
        'REJECT_PURCHASE' => 'can reject draft purchase',

    ]
    
]




?>