//
//  SessionModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

struct APISession {
    // https://stackoverflow.com/questions/52591866/whats-the-correct-usage-of-urlsession-create-new-one-or-reuse-same-one
    public var token: String?
    public var usuario: Usuario?
    // Função que retorna a sessão ou cria ela caso não exista
    public var session: URLSession
    public init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 30
        config.httpShouldSetCookies = true
        config.httpCookieAcceptPolicy = .always
        config.httpCookieStorage = HTTPCookieStorage.shared
        session = URLSession(configuration: config)
    }
    
}
