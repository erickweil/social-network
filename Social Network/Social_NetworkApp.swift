//
//  Social_NetworkApp.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

@main
struct Social_NetworkApp: App {
    @StateObject var store = AppDataStore()
    
    var body: some Scene {
        WindowGroup {
            NavigationView {
                NovoLoginView() {
                    InicioView()
                        .navigationBarBackButtonHidden(true)
                }
            }
            .environmentObject(store)
            .environment(\.imageCache, ImageCacheViewModel())
            .environment(\.httpClient, HTTPClient())
        }
    }
}
