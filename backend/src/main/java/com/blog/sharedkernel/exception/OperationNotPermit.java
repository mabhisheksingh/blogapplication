package com.blog.sharedkernel.exception;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

public class OperationNotPermit extends BaseException{

    public OperationNotPermit(String userName,String message) {
        super(
                HttpStatus.BAD_REQUEST, "OPERATION_NOT_PERMIT",message, userName);
    }
}
