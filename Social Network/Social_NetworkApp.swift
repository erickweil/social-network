//
//  Social_NetworkApp.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

@main
struct Social_NetworkApp: App {
    @Namespace public var AppNS
    
    @StateObject var store = AppDataStore(httpClient: HTTPClient())
    
    var body: some Scene {
        WindowGroup {
            NavigationView {
                LoginView() {
                    InicioView()
                        .navigationBarBackButtonHidden(true)
                }
            }.environmentObject({ () -> AppDataStore in
                store.AppNS = AppNS
                return store
            }())
        }
    }
}
