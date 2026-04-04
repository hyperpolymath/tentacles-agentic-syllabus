; SPDX-License-Identifier: PMPL-1.0-or-later
;; guix.scm — GNU Guix package definition for 7-tentacles
;; Usage: guix shell -f guix.scm

(use-modules (guix packages)
             (guix build-system gnu)
             (guix licenses))

(package
  (name "7-tentacles")
  (version "0.1.0")
  (source #f)
  (build-system gnu-build-system)
  (synopsis "7-tentacles")
  (description "7-tentacles — part of the hyperpolymath ecosystem.")
  (home-page "https://github.com/hyperpolymath/7-tentacles")
  (license ((@@ (guix licenses) license) "PMPL-1.0-or-later"
             "https://github.com/hyperpolymath/palimpsest-license")))
