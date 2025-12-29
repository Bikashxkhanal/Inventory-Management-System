<?php 

namespace App\Contracts;

abstract class InputValidation{
    abstract public function validate(array $input):array| bool;


}