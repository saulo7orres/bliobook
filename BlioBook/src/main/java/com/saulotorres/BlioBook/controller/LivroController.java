package com.saulotorres.BlioBook.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import com.saulotorres.BlioBook.entities.Livro;
import com.saulotorres.BlioBook.service.LivroService;

@RestController
@RequestMapping("/livros")
@CrossOrigin("*")
public class LivroController {

    @Autowired
    private LivroService service;

    @GetMapping
    public List<Livro> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Livro buscar(@PathVariable @NonNull Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public Livro inserir(@RequestBody @NonNull Livro livro) {
        return service.salvar(livro);
    }

    @PutMapping("/{id}")
    public Livro atualizar(@RequestBody @NonNull Livro livro, @PathVariable @NonNull Long id) {
        livro.setId(id);
        return service.salvar(livro);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable @NonNull Long id) {
        service.excluir(id);
    }
}