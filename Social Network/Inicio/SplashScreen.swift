//
//  SplashScreen.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 17/10/23.
//

import SwiftUI

struct HeartSZAnim: View {
    var fillColor: Color = Color("AccentColor")
    @State var anim: CGFloat = 0.0
    
    var body: some View {
        
        VStack {
            ZStack {
                HeartSZ(left: false, right: true)
                    .stroke(lineWidth: 5.50)
                    .padding(40)
                    .neonFlicker(isFaceUp: anim == 1.0, backColor: Color("AccentColor"), frontColor: Color.white)
                    .frame(width: 200, height: 200)
                    .animation(.spring(response: 0.75,dampingFraction: 0.70), value: anim)
                
                HeartSZ(left: true, right: false)
                    .stroke(lineWidth: 5.50)
                    .padding(40)
                    .neonFlicker(isFaceUp: anim == 1.0, backColor: Color("AccentColor"), frontColor: Color.white)
                    .frame(width: 200, height: 200)
                    .animation(.spring(response: 0.4,dampingFraction: 0.60).delay(0.15), value: anim)
            }
            
            HStack(spacing: 0) {
                Text("S").bold()
                    .neonFlicker(isFaceUp: anim == 1.0, backColor: Color("AccentColor"), frontColor: .white)
                    .animation(.spring(response: 0.6,dampingFraction: 0.60).delay(0.25), value: anim)
                
                if anim == 1.0 {
                    Text("ociali")
                        .transition(.opacity)
                }
                
                Text("z").bold()
                    .neonFlicker(isFaceUp: anim == 1.0, backColor: Color("AccentColor"), frontColor: .white)
                    .animation(.spring(response: 0.5,dampingFraction: 0.75).delay(0.15), value: anim)
                
                if anim == 1.0 {
                    Text("e")
                        .transition(.opacity)
                }
            }
            .animation(.default.delay(2.0), value: anim)
            .foregroundColor(.white)
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
            Color.black
            
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
            try? await Task.sleep(nanoseconds: 2_350_000_000)
            
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
