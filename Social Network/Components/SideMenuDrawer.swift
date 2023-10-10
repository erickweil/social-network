//
//  SideMenuDrawer.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

extension View {
    func sideMenuDrawer<C: View>(menuOpened: Binding<Bool>,menuContent: @escaping () -> C) -> some View {
        modifier(SideMenuDrawer(menuOpened: menuOpened,menuContent: menuContent))
    }
}

struct SideMenuDrawer<C>: ViewModifier where C: View {
    @Binding
    var menuOpened: Bool
    
    var menuContent: () -> C
    
    @State var translation: CGFloat = 0.0
    func body(content: Content) -> some View {
        content
        .overlay {
            ZStack {
                if menuOpened {
                    Color(.gray)
                        .ignoresSafeArea()
                        .opacity(0.5)
                        .transition(.opacity)
                        .onTapGesture {
                            menuOpened.toggle()
                        }
                        .zIndex(1.0)
                    
                        menuContent()
                        .background {
                            Color(.systemBackground)
                                .ignoresSafeArea()
                                .shadow(radius: 10.0)
                        }
                        .padding(.trailing, 80)
                        .offset(x: translation)
                        //.transition(.identity)
                        .transition(.move(edge: .leading))
                        .zIndex(2.0)
                        .gesture(DragGesture().onChanged { value in
                            self.translation = value.translation.width
                            if self.translation > 0.0 {
                                self.translation = 0.0
                            }
                        }.onEnded { value in
                                if self.translation > -100 {
                                    withAnimation {
                                        self.translation = 0.0
                                    }
                                } else {
                                    self.translation = 0.0
                                    menuOpened.toggle()
                                }
                        })
                }
            }
            .animation(.easeIn(duration: 0.25), value: menuOpened)
        }
    }
}


struct SideMenuDrawerTeste: View {
    @State var opened: Bool = false
    var body: some View {
        ViewExample(imageName: "phone.fill", color: .systemRed)
        .onTapGesture {
            opened.toggle()
        }
        .sideMenuDrawer(menuOpened: $opened) {
            VStack(alignment: .leading) {
                Color(.lightGray)
                    .frame(width: 60,height:60)
                    .clipShape(Circle())
                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 10)
                
                Color(.lightGray)
                .frame(height: 17.0)
                .padding(.top, 10)
                
                Divider()
                
                Spacer()
            }
        }
    }
}

struct SideMenuDrawer_Previews: PreviewProvider {
    static var previews: some View {
        SideMenuDrawerTeste()
    }
}
