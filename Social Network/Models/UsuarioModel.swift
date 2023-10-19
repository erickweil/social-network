//
//  UsuarioModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

// Structs para fazer o parse do JSON que a api responde
struct Usuario: Hashable, Codable, Identifiable {
    var id: String { _id }
    let _id: String
    let nome: String
    let email: String
    let fotoPerfil: String
    let fotoCapa: String
    let biografia: String
    let created_at: String
    let updated_at: String
    
static let exemplo = Usuario(_id: "AAAAAAAAAAAA", nome: "Usuário Exemplo", email: "exemplo@gmail.com", fotoPerfil: "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg", fotoCapa: "", biografia: "sem biografia", created_at: ".", updated_at: ".")
}

struct LoginResponse: Hashable, Codable {
    let token: String
    let usuario: Usuario
}

struct CadastrarErroResponse: Hashable, Codable {
    let error: Bool
    let message: String?
    let validation: CadastroValidacao?
    
    struct CadastroValidacao: Hashable, Codable {
        let nome: String?
        let email: String?
        let senha: String?
    }
}


typealias ListagemUsuario = ListagemDeAlgo<Usuario>
