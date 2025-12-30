<?php
return [
    'roles' => [
        'superadmin' => [
            'CREATE_USER',
            'CREATE_VENDOR',
            'DELETE_USER',
            'DELETE_VENDOR',
            'GENERATE_REPORT',
            'VIEW_REPORT',
            'VIEW_STOCK'
    
        ],
        'admin' => [
             'CREATE_USER',
             'GENERATE_REPORT',
             'VIEW_REPORT',
             'VIEW_STOCK',
            

        ],
        'manager' => [
            'GENERATE_REPORT',
             'VIEW_REPORT',
             'CREATE_PO',
             'REVERSE_SALE',
             'VIEW_STOCK'
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
        

    ]
    
]




?>