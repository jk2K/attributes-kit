import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import each from 'lodash/each';

function processElement(refractElement) {
  if (!refractElement) {
    return;
  }

  const attributes = refractElement.attributes;

  // Then, see if it the element has any samples and process them as well!
  if (attributes && !isEmpty(attributes.samples)) {
    attributes.samples = map(attributes.samples, (sample) => {
      if (isArray(sample) || isObject(sample)) {
        return sample;
      }

      return {
        element: refractElement.element,
        content: sample,
      };
    });
  }

  // Then, see if it has children and process each of the children as well!
  if (refractElement.content) {
    if (refractElement.element === 'member' && refractElement.content.value) {
      // This is a member of an object.
      processElement(refractElement.content.value);
    } else if (refractElement.content.length && refractElement.content[0].element) {
      // This is an array of items.
      each(refractElement.content, (nestedRefractElement) => {
        processElement(nestedRefractElement);
      });
    }
  }

  return refractElement;
}

export function preprocess(refractElement) {
  return processElement(refractElement);
};
