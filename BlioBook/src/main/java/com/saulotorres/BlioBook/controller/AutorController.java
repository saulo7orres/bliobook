package com.saulotorres.BlioBook.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import com.saulotorres.BlioBook.entities.Autor;
import com.saulotorres.BlioBook.service.AutorService;

@RestController
@RequestMapping("/autores")
@CrossOrigin("*")
public class AutorController {

    @Autowired
    private AutorService service;

    @GetMapping
    public List<Autor> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Autor buscar(@PathVariable @NonNull Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public Autor inserir(@RequestBody @NonNull Autor autor) {
        return service.salvar(autor);
    }

    @PutMapping("/{id}")
    public Autor atualizar(@RequestBody @NonNull Autor autor, @PathVariable @NonNull Long id) {
        autor.setId(id);
        return service.salvar(autor);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable @NonNull Long id) {
        service.excluir(id);
    }
}