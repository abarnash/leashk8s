(ns helloworld-clj.core
  (:use ring.adapter.jetty)
  (:gen-class))

(defn handler [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body (str "Greetings, "
              (if-let [target (System/getenv "TARGET")]
                target
                "World")
              "\n from "
              (if-let [source (System/getenv "SOURCE")]
                source
                "God")

              "(clojure rules)\n")})

(defn -main [& args]
  (run-jetty handler {:port (if-let [port (System/getenv "PORT")]
                              (Integer/parseInt port)
                              8080)}))
