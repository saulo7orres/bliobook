package com.saulotorres.BlioBook.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import com.saulotorres.BlioBook.entities.Categoria;
import com.saulotorres.BlioBook.service.CategoriaService;

@RestController
@RequestMapping("/categorias")
@CrossOrigin("*")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    @GetMapping
    public List<Categoria> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Categoria buscar(@PathVariable @NonNull Long id) {
        return service.buscar(id);
    }

    @PostMapping
    public Categoria inserir(@RequestBody @NonNull Categoria categoria) {
        return service.salvar(categoria);
    }

    @PutMapping("/{id}")
    public Categoria atualizar(@RequestBody @NonNull Categoria categoria, @PathVariable @NonNull Long id) {
        categoria.setId(id);
        return service.salvar(categoria);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable @NonNull Long id) {
        service.excluir(id);
    }
}