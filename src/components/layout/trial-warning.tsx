{
  /* Trial Warning when less than 7 days */
}
{
  /* {isTrialActive && trialDaysLeft <= 7 && trialDaysLeft > 0 && (
            <Card className="bg-yellow-900/20 border-yellow-600/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-yellow-400" />
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-semibold">
                      ¡Tu prueba gratuita termina pronto!
                    </h3>
                    <p className="text-yellow-200 text-sm">
                      Te quedan {trialDaysLeft} días. Elige un plan para
                      continuar sin interrupciones.
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-900/20 bg-transparent"
                      >
                        Ver Planes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-800/30 max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white text-2xl">
                          No Pierdas el Acceso
                        </DialogTitle>
                        <DialogDescription className="text-purple-200">
                          Elige tu plan ahora y continúa entrenando sin
                          interrupciones
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid md:grid-cols-3 gap-6 mt-6">
                        {Object.entries(plans).map(([key, plan]) => (
                          <Card
                            key={key}
                            className={`bg-black/40 backdrop-blur-sm ${
                              key === "premium"
                                ? "border-purple-400 relative"
                                : "border-purple-800/30"
                            }`}
                          >
                            {key === "premium" && (
                              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                                Más Popular
                              </Badge>
                            )}
                            <CardHeader className="text-center">
                              <CardTitle className="text-white text-2xl flex items-center justify-center">
                                {key === "elite" && (
                                  <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                                )}
                                {plan.name}
                              </CardTitle>
                              <div className="text-4xl font-bold text-purple-400">
                                €{plan.price}
                              </div>
                              <CardDescription className="text-purple-200">
                                por mes
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {plan.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                  <span className="text-purple-200">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                              <Button
                                onClick={() => handleSubscribe(key)}
                                className={`w-full mt-6 ${
                                  key === "elite"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                              >
                                Elegir Plan
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )} */
}
