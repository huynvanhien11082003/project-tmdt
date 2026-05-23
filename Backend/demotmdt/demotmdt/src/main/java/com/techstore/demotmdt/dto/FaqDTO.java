package com.techstore.demotmdt.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqDTO {
    private String question;
    private String answer;
}
