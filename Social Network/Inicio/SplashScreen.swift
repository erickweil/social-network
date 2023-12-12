//
//  SplashScreen.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 17/10/23.
//

import SwiftUI

struct HeartSZAnim: View {
    var fillColor: Color = Color.destaque
    @State var anim: CGFloat = 0.0
    
    var body: some View {
        
        VStack {
            ZStack {
                
                HeartSZ(left: true, right: true)
                    .fill(Color.destaque)
                    .padding(40)
                    .frame(width: 200, height: 200)
                    .scaleEffect(anim)
                    .animation(.easeInOut(duration: 0.33).delay(0.66), value: anim)
                
                HeartSZ(left: true, right: false)
                    .trim(from: 0, to: anim)
                    .stroke(Color.primaria,lineWidth: 5.50)
                    .padding(40)
                    .frame(width: 200, height: 200)
                    .animation(.easeInOut(duration: 0.33), value: anim)
                
                HeartSZ(left: false, right: true)
                    .trim(from: 0, to: anim)
                    .stroke(Color.primaria,lineWidth: 5.50)
                    .padding(40)
                    .frame(width: 200, height: 200)
                    .animation(.easeInOut(duration: 0.33).delay(0.33), value: anim)
            }
            
            HStack(spacing: 0) {
                Text("Socialize").bold()
                    .opacity(anim == 1 ? 1.0 : 0.0)
            }
            .animation(.easeInOut(duration: 0.33).delay(0.66), value: anim)
            .foregroundColor(Color.texto)
            .font(.system(size: 52))
        }
        .onAppear {
            //withAnimation {
                anim = 1.0
            //}
        }
    }
}

struct SplashScreen<Content>: View where Content: View {
    var content: () -> Content
    
        
    @StateObject
    var vm: LoginViewModel = LoginViewModel()
    
    @State var finishedSplash: Bool = false
        
    var body: some View {
        ZStack {
            Color.destaque2
            
            VStack {
                HeartSZAnim()
                                
                if finishedSplash {
                    content()
                        .environmentObject(vm)
                        .transition(.move(edge: .bottom))
                }
            }
        }
        .ignoresSafeArea(.all)
        .task {
            if !vm.token.isEmpty {
                let resp = try? await HTTPClient.instance.fetch(
                    APIs.usuarioLogado.url,
                    FetchOptions(
                        method: .GET,
                        headers: ["Authorization": "Bearer \(vm.token)"]
                    )
                )
                
                if let resp, let respUsuario = try? resp.json(Usuario.self) {
                    DispatchQueue.main.async {
                        vm.setarMensagemErro("")
                        vm.usuario = respUsuario
                        vm.navegarLogin = true
                    }
                }
            }
        }
        .task {
            // Delay da animação
            try? await Task.sleep(nanoseconds: 1_000_000_000)
            
            DispatchQueue.main.async {
                withAnimation {
                    finishedSplash = true
                }
            }
        }
    }
}

struct SplashScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            SplashScreen {
                NovoLoginView() {
                    ViewExample(imageName: "photo", color: .blue)
                }
            }
        }
    }
}
