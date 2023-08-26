//
//  APIs.swift
//  Memoria
//
//  Created by Erick Leonardo Weil on 25/08/23.
//

import Foundation

enum APIs {
    case postagens
    case login
    
    public static var baseURL: URL {
        URL(string: "https://socialize-api.app.fslab.dev")!
    }
    
    
    var url: URL {
        switch self {
        case .postagens:
            return APIs.baseURL.appendingPathComponent("/postagens")
        case .login:
            return APIs.baseURL.appendingPathComponent("/login")
        }
    }
}
